using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Playables;

public class Player : MonoBehaviour
{
    public float MoveSpeed = 5f;
    private Rigidbody2D rb;

    public float dashBoost;
    public float dashTime;
    private float _DashTime;
    private bool once;
    public Animator Animator;
    public GameObject GhostEffect;
    public float GhostDelay;
    private Coroutine DashEffectCoroutine;

    public SpriteRenderer CharacterSR;
    public Vector3 MoveInput;

    private void Start()
    {
        Animator = GetComponentInChildren<Animator>();
    }

    private void Update()
    {
        MoveInput.x = Input.GetAxis("Horizontal");
        MoveInput.y = Input.GetAxis("Vertical");
        transform.position += MoveInput * MoveSpeed * Time.deltaTime;

        Animator.SetFloat("Speed", MoveInput.sqrMagnitude);

        if (Input.GetKeyDown(KeyCode.Space) && _DashTime <= 0)
        {
            MoveSpeed += dashBoost;
            _DashTime = dashTime;
            once = true;
            StartDashEffect();
        }

        if(_DashTime <= 0 && once)
        {
            MoveSpeed -= dashBoost;
            once = false;
            StopDashEffect();
        }
        else
        {
            _DashTime -= Time.deltaTime;
        }

        
        if (MoveInput.x != 0)
        {
            if (MoveInput.x < 0)
                CharacterSR.transform.localScale = new Vector3((float)-0.3, (float)0.3, 0);
            else
                CharacterSR.transform.localScale = new Vector3((float)0.3, (float)0.3, 0);
        }
    }

    void StopDashEffect()
    {
        if (DashEffectCoroutine != null) StopCoroutine(DashEffectCoroutine);
        
    }
    void StartDashEffect()
    {
        if (DashEffectCoroutine != null) StopCoroutine(DashEffectCoroutine);
        DashEffectCoroutine = StartCoroutine(dashEffectCoroutine());
    }

    IEnumerator dashEffectCoroutine()
    {
        while (true)
        {
            GameObject ghost = Instantiate(GhostEffect, transform.position, transform.rotation);
            Sprite currentSprite = CharacterSR.sprite;
            ghost.GetComponentInChildren<SpriteRenderer>().sprite = currentSprite;

            Destroy(ghost, 0.5f);
            yield return new WaitForSeconds(GhostDelay);
        }
    }

    public IntakeDmg playerHealth;
    public void TakeDamage(int damage)
    {
        playerHealth.TakeDam(damage);
    }
}
