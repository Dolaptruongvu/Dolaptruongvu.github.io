using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Weapon : MonoBehaviour
{
    public GameObject bullet;
    public Transform FirePos;
    public GameObject muzzle;
    public float FireRate = 0.2f;
    public float BulletForce;

    private float FireRate2;

    void Update()
    {
        RotateWithMouse();
        FireRate2 -= Time.deltaTime;

        if (Input.GetMouseButton(0) && FireRate2 < 0)
        {
            FireBullet();
        }

    }

    void RotateWithMouse()
    {
        Vector3 MousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Vector2 LookDirection = MousePos - transform.position;
        float angle = Mathf.Atan2(LookDirection.y, LookDirection.x) * Mathf.Rad2Deg;

        Quaternion rotation = Quaternion.Euler(0, 0, angle);
        transform.rotation = rotation;

        if (transform.eulerAngles.z > 90 && transform.eulerAngles.z < 270)
            transform.localScale = new Vector3(3, -3, 0);
        else
            transform.localScale = new Vector3(3, 3, 0);
    }

    void FireBullet()
    {
        FireRate2 = FireRate;

        GameObject Travelbullet = Instantiate(bullet, FirePos.position, Quaternion.identity);

        //effect
        Instantiate(muzzle, FirePos.position, transform.rotation, transform);


        Rigidbody2D rb = Travelbullet.GetComponent<Rigidbody2D>();
        rb.AddForce(transform.right * BulletForce, ForceMode2D.Impulse);
    }
}
